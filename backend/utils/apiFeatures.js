class apiFeatures {
  constructor(querry, querryStr) {
    (this.querry = querry), (this.querryStr = querryStr);
  }

  search() {
    const keyword = this.querryStr.keyword
      ? {
          name: {
            $regex: this.querryStr.keyword,
            $options: "i", //small i means case insenstive
          },
        }
      : {};
    this.querry = this.querry.find({ ...keyword });
    return this;
  }

  filter() {
    const querryStrCopy = { ...this.querryStr }; //making a copy of this.qyerryStr obj
    const removeFields = ["keyword", "page", "limit"]; //this fields should not come in query  we only need category
    removeFields.forEach((key) => delete querryStrCopy[key]);

    //price filter
    console.log(querryStrCopy);
    let querryStrCopyString = JSON.stringify(querryStrCopy);
    querryStrCopyString = querryStrCopyString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    ); //$sign is not there and mongodb cant read it

    this.querry = this.querry.find(JSON.parse(querryStrCopyString));
    console.log(querryStrCopyString);
    return this;
    //there is no case sensitive feature like in search bc cateories are going to be pre listed and not take on text input
  }

  //for products per page
  pagination(resultPerPage) {
    const currentPage = Number(this.querryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1); //this skips the product to be displayed
    this.querry = this.querry.find().limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = apiFeatures;
