function makeTransaction(quantity, pricePerDroid) {
    const result = `You ordered ${quantity} droids worth ${pricePerDroid * quantity} credits!`;
   return result; 
};
   
console.log(makeTransaction(5, 3000));
console.log(makeTransaction(3, 1000));
console.log(makeTransaction(10, 500));