import shop from "@/api/shop"

export default{ // = methods
    fetchProducts ({commit}) {
        return new Promise((resolve, reject) => {

        
        // make the call
        shop.getProducts(products => {
            commit ('setProducts', products)
            resolve ()
         })
        })
    },

    addProductToCart ({state, getters,commit}, product) {
        if (commit.getters.productIsInStock(product)) {
            const cartItem = context.state.cart.find(item => item.id === product.id)
           // find cartItem
            if (!cartItem) {
            commit('pushProductToCart', product.id)
            //pushProductToCart
            } else {
            commit('incrementItemQuantity', cartItem)
            // incrementItemQuantity
            } 
            commit('decrementProductInventory', product)
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
     }