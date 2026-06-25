import { useReviews } from "@/hooks/useReviews";
import Header from "../components/Header";
import SafeScreen from "../components/SafeScreen";
import { useOrders } from "@/hooks/useOrders";
import { useState } from "react";
import { Order } from "../../../shared/order.types";
import { Alert, ScrollView } from "react-native";
import LoadingUI from "../components/LoadingUI";
import ErrorUI from "../components/ErrorUI";
import EmptyUI from "../components/EmptyUI";
import OrderItem from "../components/OrderItem";
import RatingModal from "../components/RatingModal";

const OrdersScreen = () => {
  const { data: orders, isLoading, isError, error } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRating, setProductRating] = useState<{ [key: string]: number }>(
    {},
  );

  const handleOpenRating = (order: Order) => {
    setSelectedOrder(order);
    setShowRatingModal(true);

    // init ratings for all product to 0 - resetting the state for each product
    const initialRatings: { [key: string]: number } = {};

    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });

    setProductRating(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    // check if all products have been rated
    const allRated = Object.values(productRating).every((rating) => rating > 0);
    if (!allRated) {
      Alert.alert("Error", "Please rate all products");
      return;
    }
    try {
      await Promise.all(
        selectedOrder.orderItems.map((item) =>
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRating[item.product._id],
          })
        ),
      );
      Alert.alert("Success", "Thank you for rating all products!");
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRating({});
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.error || "Failed to submit rating",
      );
    }
  };

  return (
    <SafeScreen>
      <Header title="My Orders" />
      {isLoading ? (
        <LoadingUI title="Orders" />
      ) : isError ? (
        <ErrorUI title="Orders" error={error as Error} />
      ) : orders && orders?.length === 0 ? (
        <EmptyUI
          title="Orders"
          description="No orders found"
          actionTitle="Your order history will appear here as you shop"
        />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {orders?.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onRatePress={() => handleOpenRating(order)}
            />
          ))}
        </ScrollView>
      )}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRating={productRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRating({ ...productRating, [productId]: rating })
        }
        onSubmit={handleSubmitRating}
      />
    </SafeScreen>
  );
};

export default OrdersScreen;
