const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('does NOT mutate input array', () => {
    const original = [1, 2, 3, 4, 5];
    formatDates(original);
    expect(original).to.eql([1, 2, 3, 4, 5]);
  });
  it('does NOT mutate objects within input array', () => {
    const original = [{ a: 1 }, { b: 2 }, { c: 3 }];
    formatDates(original);
    expect(original).to.eql([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });
  it('returns an array with a single object that has the `created_at` property correctly foramtted', () => {
    const input = [
      {
        body:
          'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
        belongs_to: '22 Amazing open source React projects',
        created_by: 'grumpy19',
        votes: 3,
        created_at: 1504183900263
      }
    ];
    expect(formatDates(input)[0].created_at).to.be.instanceOf(Date);
  });
  it('works with multiple objects in an array', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expect(formatDates(input)[0].created_at).to.be.instanceOf(Date);
    expect(formatDates(input)[1].created_at).to.be.instanceOf(Date);
    expect(formatDates(input)[2].created_at).to.be.instanceOf(Date);
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('does NOT mutate input array', () => {
    const original = [1, 2, 3, 4, 5];
    makeRefObj(original);
    expect(original).to.eql([1, 2, 3, 4, 5]);
  });
  it('does NOT mutate objects within input array', () => {
    const original = [{ a: 1 }, { b: 2 }, { c: 3 }];
    makeRefObj(original);
    expect(original).to.eql([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });
  it('returns an object with the correct key-value pair when passed an array of one object', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }])).to.eql({ A: 1 });
  });
  it('works with multiple objects in array', () => {
    expect(
      makeRefObj([
        { article_id: 1, title: 'A' },
        { article_id: 2, title: 'B' },
        { article_id: 99, title: 'hello' }
      ])
    ).to.eql({ A: 1, B: 2, hello: 99 });
  });
  it('accepts arguments for keys to be included', () => {
    expect(
      makeRefObj(
        [
          { sampleKey: 1, testValue: 'A' },
          { sampleKey: 2, testValue: 'B' },
          { sampleKey: 25, testValue: 'hi' }
        ],
        'testValue',
        'sampleKey'
      )
    ).to.eql({ A: 1, B: 2, hi: 25 });
  });
});

describe('formatComments', () => {
  const input = [
    {
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    }
  ];
  const refObj = { "They're not exactly dogs, are they?": 5 };
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([], refObj)).to.eql([]);
  });
  it('does NOT mutate input array', () => {
    const original = [1, 2, 3, 4, 5];
    formatComments(original, refObj);
    expect(original).to.eql([1, 2, 3, 4, 5]);
  });
  it('does NOT mutate objects within input array', () => {
    const original = [{ a: 1 }, { b: 2 }, { c: 3 }];
    formatComments(original, refObj);
    expect(original).to.eql([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });
  describe('Objects within returned array', () => {
    it('`created_by` renamed to `author`', () => {
      expect(formatComments(input, refObj)[0].author).to.equal('butter_bridge');
      expect(formatComments(input, refObj)[0].created_by).to.equal(undefined);
    });
    it('`belongs_to` renamed to `article_id` and value is replaced', () => {
      expect(formatComments(input, refObj)[0].article_id).to.equal(5);
      expect(formatComments(input, refObj)[0].belongs_to).to.equal(undefined);
    });
    it('`created_at` converted to date object', () => {
      expect(formatComments(input, refObj)[0].created_at).to.be.instanceOf(
        Date
      );
    });
    it('retains all other information', () => {
      expect(formatComments(input, refObj)[0].body).to.equal(
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
      );
      expect(formatComments(input, refObj)[0].votes).to.equal(16);
    });
  });
});
