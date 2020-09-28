import DB from "./appdb";
import Video from "./datamodel/Video";
import Note from "./datamodel/Note";

test("adds new videos", () => {
  return Promise.all([
    DB.video.add(new Video()),
    DB.video.add(new Video()),
  ]).then(() => {
    return DB.video.toArray().then((array) => {
      expect(array.length).toBe(2);
    });
  });
});

test("adds new notes", () => {
  return Promise.all([DB.note.add(new Note()), DB.note.add(new Note())]).then(
    () => {
      return DB.note.toArray().then((array) => {
        expect(array.length).toBe(2);
      });
    }
  );
});
