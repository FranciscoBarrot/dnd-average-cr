const axios = require('axios');
const { count } = require('console');

axios.get('https://www.dnd5eapi.co/api/monsters/').then(async (res) => {
  try {
    let monstersPromises = [];
    res.data.results.forEach((el) => {
      monstersPromises.push(axios.get(`https://www.dnd5eapi.co${el.url}`));
    });
    const monsters = await (
      await Promise.all(monstersPromises)
    ).map((el) => el.data);

    let info = [];
    let keys = {};
    monsters.forEach((mons) => {
      if (Number.isInteger(keys[mons.type])) {
        info[keys[mons.type]].cr += mons.challenge_rating;
        info[keys[mons.type]].count++;
      } else {
        keys[mons.type] = Object.keys(keys).length;
        info[keys[mons.type]] = {
          type: mons.type,
          cr: mons.challenge_rating,
          count: 1,
        };
      }
    });

    info.forEach((type) => {
      type.average_cr = Math.round((type.cr / type.count) * 100) / 100;
    });
    console.log(info);
  } catch (error) {
    console.log(error);
  }
});
