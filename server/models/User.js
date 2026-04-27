import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    stripeCustomerId: {
      type: String
    },
    stripeSubscriptionId: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    },
    collection: "users"
  }
);

userSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
