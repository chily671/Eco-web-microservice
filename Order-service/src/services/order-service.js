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
        return order;
    }

    async GetUserOrder(data) {
        const order = await this.orderRepository.GetUserOrder(data);
        return order;
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

    async SubscribeEvents(payload){
 
        payload = JSON.parse(payload);
        const { event, data } = payload;
        const { userId, product, qty } = data;
        
        switch(event){
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product, qty, true);
                break;
            default:
                break;
        }
    }
 
        async GetOrderPayload(userId,order,event){

            if(order){
                 const payload = { 
                    event: event,
                    data: { userId, order }
                };
     
                 return payload
            }else{
                return FormateData({error: 'No Order Available'});
            }
     
        }



}

module.exports = OrderService;