export const createRandomUserId: () => string = () => {
    // Length of the generated user ID
    const idLength = 10;
  
    // Characters to use in the generated user ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    // Generate the user ID
    let userId = '';
    for (let i = 0; i < idLength; i++) {
      userId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return userId;
  };
  