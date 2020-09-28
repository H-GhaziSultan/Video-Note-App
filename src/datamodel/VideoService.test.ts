import VideoService from "./VideoService";

let vs: VideoService;

beforeAll(() => {
  vs = VideoService.getInstance();
});

test("creates Videos", () => {
  return vs.create().then((video) => {
    video.title = "Test";
    video.author = "Test author";
    video.uri = "https://lol.com";

    expect(video.id).not.toEqual(undefined);
    expect(video.id).toEqual(1);
  });
});

test("creates multiple Videos", () => {
  let video1 = vs.create();
  let video2 = vs.create();

  return Promise.all([video1, video2]).then((videos) => {
    expect(videos[0].id).toEqual(vs.maxID! - 1);
    expect(videos[1].id).toEqual(vs.maxID);
  });
});

test("assign values", () => {
  let video1 = vs.create().then((video) => {
    video.title = "Test the title";
    video.author = "Test author";
    video.uri = "https://test.com";

    return video;
  });

  return video1.then((video) => {
    expect(video.id).toEqual(vs.maxID);
    expect(video.title).toEqual("Test the title");
    expect(video.author).toEqual("Test author");
    expect(video.uri).toEqual("https://test.com");
  });
});

test("assign values and save", () => {
  return vs
    .create()
    .then((video) => {
      video.title = "Test the title";
      video.author = "Test author";
      video.uri = "https://test.com";

      return video;
    })
    .then((video) => {
      return vs.save(video);
    })
    .then((id) => {
      expect(id).toEqual(vs.maxID);
    });
});
