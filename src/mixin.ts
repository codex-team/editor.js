import uuidv4 from 'uuid/v4';

export default {
  createId() {
    let id = uuidv4();

    const existId = () => {
      if (document.getElementById(id)) {
        return true;
      } else {
        return false;
      }
    };

    do {
      id = uuidv4();
    } while (!existId);

    return id;
  },
};
