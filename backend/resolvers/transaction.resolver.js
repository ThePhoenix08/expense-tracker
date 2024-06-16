import Transaction from "../models/transaction.model.js";

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
    categoryStats: async (_, __, context) => {
      const user = context.getUser();
      if (!user) throw new Error("User not authorised");
      const transactionData = await Transaction.find({
        userId: user._id,
      });
      const categoryMap = {};
      transactionData.forEach((transaction) => {
        let { amount, category } = transaction;
        if (!categoryMap.hasOwnProperty(transaction.category)) {
          categoryMap[category] = amount;
        } else {
          categoryMap[category] += amount;
        }
      });
      console.log(categoryMap);
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
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
    deleteTransaction: async (_, { transactionId }) => {
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
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.error("Error getting user: ", error);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
