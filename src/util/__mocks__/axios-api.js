import wa_9_hydrated from "../../test/fixtures/districts/wa_9_hydrated.json";
import districts from "../../test/fixtures/districts/districts.json";
import themes from "../../test/fixtures/themes/themes.json";

// This is more of a stub. Need to make this more dynamically configurable

export default {
  get: jest.fn((path) => {
    var data;

    if (path === "themes") {
      data = themes;
    } else if (path === "districts") {
      data = districts;
    } else if (path.indexOf("hydrated") !== -1) {
      data = wa_9_hydrated;
    }

    return Promise.resolve({
      data
    });
  }),
  post: jest.fn(()=> {
      return Promise.resolve({data:{}})
  })
};
