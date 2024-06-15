import Transaction from "../models/transaction.model.js";
import mongoose from "mongoose";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        const userId = await context.getUser()._id;
        if (!userId) throw new Error("User unauthorized");

        const transactions = await Transaction.find({
          userId: userId,
        });
        return transactions;
      } catch (error) {
        console.error("Error getting transactions: ", error);
        throw new Error("Error getting transactions.");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error getting transaction: ", error);
        throw new Error("Error getting transaction.");
      }
    },
    // TODO => ADD CATEGORY STATISTICS
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      const userId = context.getUser()._id;
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: userId,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error creating transaction", error);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        console.log("Transaction ID: " + input.transactionId);
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          {
            _id: input.transactionId,
          },
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.error("Error updating transaction", error);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.error("Error deleting transaction", error);
        throw new Error("Error deleting transaction");
      }
    },
    // TODO => Transaction - User relationships
  },
};

export default transactionResolver;
