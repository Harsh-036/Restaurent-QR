const registerTemplate = (CustomerName , RestaurantName) => {
    return  `Hi ${CustomerName},
    Welcome to ${RestaurantName}! 🎉
    As a thank-you for signing up, here’s a special offer just for you:
    🎁 Use Code: FIRST30  
    💰 Get 30% OFF on your first order
    Offer valid for a limited time.
    Happy eating! 🍕  
    ${RestaurantName} Team`;
}
 
console.log(registerTemplate('harsh' , 'restaurent-qr'))
 
export default registerTemplate;