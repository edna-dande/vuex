import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{ // = data
        products: [],
        //{id, quantity}
        cart: [], 
        checkoutStatus: null
    }, 

    getters: {  // = computed properties
        availableProducts (state, getters) {
        return state.products.filter(product => product.inventory > 0)
        },

        cartProducts (state) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id)
                return {
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity


                }
            }) 
        },

        cartTotal (state,getters) {
            return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
        }

    },

    actions:{ // = methods
        fetchProducts ({commit}) {
            return new Promise((resolve, reject) => {

            
            // make the call
            shop.getProducts(products => {
                commit ('setProducts', products)
                resolve ()
             })
            })
        },

        addProductToCart (context, product) {
            if (product.inventory > 0) {
                const cartItem = context.state.cart.find(item => item.id === product.id)
               // find cartItem
                if (!cartItem) {
                context.commit('pushProductToCart', product.id)
                //pushProductToCart
                } else {
                context.commit('incrementItemQuantity', cartItem)
                // incrementItemQuantity
                } 
                context.commit('decrementProductInventory', product)
                // decrementProductInventory
                }   
            },

            checkout ({state, commit}) {
                shop.buyProducts(
                    state.cart,
                    () =>{
                        commit('emptyCart')
                        commit('setCheckoutStatus', 'success')
                    },
                    
                    () => {
                        commit('setCheckoutStatus', 'fail')
                    }
                )
            }
         },
            
    
        mutations: {
       setProducts (state, products) {
        // update products

        state.products = products
        },

        pushProductToCart (state, productId) {
            state.cart.push({
                id: productId,
                quantity: 1
            })
        },

        incrementItemQuantity (state, cartItem) {
            cartItem.quantity++
        },

        decrementProductInventory (state, product ) {
            product.inventory--
        },

        setCheckoutStatus (state, status) {
            state.checkoutStatus = status
        },

        emptyCart (state) {
            state.cart = []
        }
    }
})