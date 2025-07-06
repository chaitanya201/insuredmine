const centralController = (cb) => {
  return async (req, res, next) => {
    try {
      cb(req, res, next);
    } catch (error) {
      console.error("Error in central controller:", error);
      next(error);
    }
  };
};

export default centralController;
