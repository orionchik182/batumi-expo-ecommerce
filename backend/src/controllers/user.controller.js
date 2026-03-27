export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;

    // if this is set as default, unset all other default addresses
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    const address = {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    };
    user.addresses.push(address);
    await user.save();
    return res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in addAddress controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({
        message: "Addresses fetched successfully",
        addresses: user.addresses,
      });
  } catch (error) {
    console.error("Error in getAddresses controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;

    // if this is set as default, unset all other default addresses
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault || address.isDefault;

    await user.save();
    return res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in updateAddress controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();
    return res
      .status(200)
      .json({
        message: "Address deleted successfully",
        addresses: user.addresses,
      });
  } catch (error) {
    console.error("Error in deleteAddress controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();
    return res
      .status(200)
      .json({
        message: "Product added to wishlist successfully",
        wishlist: user.wishlist,
      });
  } catch (error) {
    console.error("Error in addToWishlist controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWishlist(req, res) {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.error("Error in getWishlist controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const { productId } = req.params;
        const user = req.user;

        if(!user.wishlist.includes(productId)) {
            return res.status(400).json({ message: "Product not found in wishlist" });
        }
        
        user.wishlist.pull(productId);
        await user.save();
        return res.status(200).json({
            message: "Product removed from wishlist successfully",
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.error("Error in removeFromWishlist controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
