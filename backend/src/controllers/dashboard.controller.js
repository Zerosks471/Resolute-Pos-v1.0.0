const {
    getTodaysTopSellingItemsDB,
    getTodaysOrdersCountDB,
    getTodaysNewCustomerCountDB,
    getTodaysRepeatCustomerCountDB,
    getTodaysTotalSalesDB,
    getActiveTablesCountDB,
    getKitchenQueueCountDB
} = require("../services/dashboard.service");
const { getReservationsDB } = require("../services/reservation.service");
const { getCurrencyDB } = require("../services/settings.service");

exports.getDashboardData = async (req, res) => {
    try {
        const [
            reservations,
            topSellingItems,
            ordersCount,
            newCustomerCount,
            repeatedCustomerCount,
            currency,
            totalSales,
            activeTables,
            kitchenQueue
        ] = await Promise.all([
            getReservationsDB("today"),
            getTodaysTopSellingItemsDB(),
            getTodaysOrdersCountDB(),
            getTodaysNewCustomerCountDB(),
            getTodaysRepeatCustomerCountDB(),
            getCurrencyDB(),
            getTodaysTotalSalesDB(),
            getActiveTablesCountDB(),
            getKitchenQueueCountDB()
        ]);

        // Return both Angular format (in data field) and legacy React format (top level)
        return res.status(200).json({
            success: true,
            data: {
                totalSales,
                orderCount: ordersCount,
                activeTables,
                kitchenQueue
            },
            // Legacy data for React frontend
            reservations,
            topSellingItems,
            ordersCount,
            newCustomerCount,
            repeatedCustomerCount,
            currency
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};