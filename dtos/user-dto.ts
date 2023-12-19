class UserDto {
  number: string;
  id: string;
  username: string;
  favorites: any[];
  basket: any[];
  refreshToken: string;

  constructor(model: {
    number: string;
    _id: string;
    username: string;
    favorites: any[];
    basket: any[];
    refreshToken: string;
  }) {
    this.number = model.number;
    this.id = model._id;
    this.username = model.username;
    this.favorites = model.favorites;
    this.basket = model.basket;
    this.refreshToken = model.refreshToken;
  }
}

export default UserDto;
