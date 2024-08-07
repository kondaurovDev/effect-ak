import { describe, it, expect } from "bun:test"
import { Either } from "~effect";
import { Schema as S } from "~effect-schema";
import { RichTextSchema } from "./rich-text";

describe("rich text test suite", () => {

  it("read rich text", () => {

      const input = {
        "type": "text",
        "text": {
          "content": "Some words ",
          "link": null
        },
        "annotations": {
          "bold": false,
          "italic": false,
          "strikethrough": false,
          "underline": false,
          "code": false,
          "color": "default"
        },
        "plain_text": "Some words ",
        "href": null
      };

      const res = S.decodeUnknownEither(RichTextSchema)(input);

      expect(Either.isRight(res))

  });

  it("read equation", () => {

    const input = {
      "type": "equation",
      "equation": {
        "expression": "E = mc^2"
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "E = mc^2",
      "href": null
    }

    const res = S.decodeUnknownEither(RichTextSchema)(input);

    expect(Either.isRight(res))
    
  });

  it("mention, database", () => {

    const input = {
      "type": "mention",
      "mention": {
        "type": "database",
        "database": {
          "id": "a1d8501e-1ac1-43e9-a6bd-ea9fe6c8822b"
        }
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "Database with test things",
      "href": "https://www.notion.so/a1d8501e1ac143e9a6bdea9fe6c8822b"
    };

    const res = S.decodeUnknownEither(RichTextSchema)(input);

    expect(Either.isRight(res))

  })

  it("mention, date", () => {

    const input =   {
      "type": "mention",
      "mention": {
        "type": "date",
        "date": {
          "start": "2022-12-16",
          "end": null
        }
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "2022-12-16",
      "href": null
    };

    const res = S.decodeUnknownEither(RichTextSchema)(input);

    expect(Either.isRight(res))

  });

    it("mention, link_preview", () => {

    const input = {
      "type": "mention",
      "mention": {
        "type": "link_preview",
        "link_preview": {
          "url": "https://workspace.slack.com/archives/C04PF0F9QSD/z1671139297838409?thread_ts=1671139274.065079&cid=C03PF0F9QSD"
        }
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "https://workspace.slack.com/archives/C04PF0F9QSD/z1671139297838409?thread_ts=1671139274.065079&cid=C03PF0F9QSD",
      "href": "https://workspace.slack.com/archives/C04PF0F9QSD/z1671139297838409?thread_ts=1671139274.065079&cid=C03PF0F9QSD"
    }

    const res = S.decodeUnknownEither(RichTextSchema)(input);

    expect(Either.isRight(res))

  });

  it("mention, page", () => {

    const input = {
      "type": "mention",
      "mention": {
        "type": "page",
        "page": {
          "id": "3c612f56-fdd0-4a30-a4d6-bda7d7426309"
        }
      },
      "annotations": {
        "bold": false,
        "italic": false,
        "strikethrough": false,
        "underline": false,
        "code": false,
        "color": "default"
      },
      "plain_text": "This is a test page",
      "href": "https://www.notion.so/3c612f56fdd04a30a4d6bda7d7426309"
    }

    const res = S.decodeUnknownEither(RichTextSchema)(input);

    expect(Either.isRight(res))

  });


});
