class UserDto {
  number: number;
  id: string;
  username: string;
  favorites: any[];
  basket: any[];

  constructor(model: {
    number: number;
    _id: string;
    username: string;
    favorites: any[];
    basket: any[];
  }) {
    this.number = model.number;
    this.id = model._id;
    this.username = model.username;
    this.favorites = model.favorites;
    this.basket = model.basket;
  }
}

export default UserDto;
