const { OrderRepository } = require('../database-order');
const { FormateData } = require('../utils');

class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async Order(userID) {
        const orders = await this.orderRepository.Order(userID);
        return orders;
    }

    async CreateOrder(data) {
        const order = await this.orderRepository.CreateOrder(data);
        return FormateData(order);
    }

    async UpdateOrder(data) {
        const order = await this.orderRepository.UpdateOrder(data);
        return FormateData(order);
    }

    async DeleteOrder(data) {
        const order = await this.orderRepository.DeleteOrder(data);
        return FormateData(order);
    }

    async GetOrder(data) {
        const order = await this.orderRepository.GetOrder(data);
        return FormateData(order);
    }

    async GetOrderByID(data) {
        const order = await this.orderRepository.GetOrderByID(data);
        return FormateData(order);
    }

    async GetOrderByUserID(data) {
        const order = await this.orderRepository.GetOrderByUserID(data);
        return FormateData(order);
    }

    async GetOrderByProductID(data) {
        const order = await this.orderRepository.GetOrderByProductID(data);
        return FormateData(order);
    }

    async GetOrderByStatus(data) {
        const order = await this.orderRepository.GetOrderByStatus(data);
        return FormateData(order);
    }

}

module.exports = OrderService;