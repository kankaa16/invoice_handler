import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      trim: true,
    },

    spoc: {
      type: String,
      default: "",
    },

    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    invoiceAmount: {
      type: Number,
      required: true,
    },

    received: {
      type: Number,
      default: 0,
    },

    outstanding: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", invoiceSchema);