

const getUser = (userId)=>{

    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Something went wrong, could not find user saber.',
        500
      );
      return next(error);
    }

    return user;

}
module.exports = getUser;