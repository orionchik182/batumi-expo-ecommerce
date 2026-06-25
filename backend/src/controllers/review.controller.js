import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res) {
  try {
    const { productId, rating, orderId } = req.body;
    const user = req.user;

    if (!productId || !rating || !orderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "Not authorized to review this order" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Order must be delivered to be reviewed" });
    }

    const productInOrder = order.orderItems.find(
      (item) => item.product._id.toString() === productId.toString(),
    );

    if (!productInOrder) {
      return res.status(400).json({ message: "Product not found in order" });
    }

    const review = await Review.findOneAndUpdate(
      { productId, orderId, userId: user._id },
      { rating },
      { new: true, upsert: true, runValidators: true },
    );

    // update product rating

    const reviews = await Review.find({ productId: productId.toString() });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ message: "Product not found" });
    }

    // update order review status if all products in this order have been reviewed
    const orderProductIds = [
      ...new Set(order.orderItems.map((item) => item.product._id.toString())),
    ];
    const reviewedProductIds = new Set(
      (
        await Review.distinct("productId", {
          orderId: order._id,
          productId: { $in: orderProductIds },
        })
      ).map((id) => id.toString()),
    );
    if (orderProductIds.every((id) => reviewedProductIds.has(id))) {
      order.hasReviewed = true;
      order.reviewedAt = new Date();
      order.reviewId = review._id;
      await order.save();
    }

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    // Check if there are any remaining reviews for this order
    const remainingReviewsCount = await Review.countDocuments({
      orderId: review.orderId,
    });

    const order = await Order.findById(review.orderId);
    if (order) {
      const orderProductIds = [
        ...new Set(order.orderItems.map((item) => item.product._id.toString())),
      ];
      const reviewedProductIds = new Set(
        (
          await Review.distinct("productId", {
            orderId: order._id,
            productId: { $in: orderProductIds },
          })
        ).map((id) => id.toString()),
      );

      const isFullyReviewed = orderProductIds.every((id) =>
        reviewedProductIds.has(id),
      );

      if (!isFullyReviewed) {
        const updateDoc = {
          hasReviewed: false,
        };
        const unsetDoc = { reviewedAt: "" };

        if (remainingReviewsCount > 0) {
          const anotherReview = await Review.findOne({
            orderId: review.orderId,
          });
          if (anotherReview) {
            updateDoc.reviewId = anotherReview._id;
          } else {
            unsetDoc.reviewId = "";
          }
        } else {
          unsetDoc.reviewId = "";
        }

        await Order.findByIdAndUpdate(review.orderId, {
          $set: updateDoc,
          $unset: unsetDoc,
        });
      } else {
        const anotherReview = await Review.findOne({ orderId: review.orderId });
        if (anotherReview) {
          await Order.findByIdAndUpdate(review.orderId, {
            reviewId: anotherReview._id,
          });
        }
      }
    }

    // update product rating
    const product = await Product.findById(review.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const reviews = await Review.find({
      productId: review.productId.toString(),
    });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    product.averageRating =
      reviews.length > 0 ? totalRating / reviews.length : 0;
    product.totalReviews = reviews.length;

    await product.save();

    return res.status(200).json({
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
