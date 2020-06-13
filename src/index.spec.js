const puppeteer = require("puppeteer");
/**@type {puppeteer.Browser} */
let browser;
/**@type {puppeteer.Page} */
let page;

jest.setTimeout(30000);

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    slowMo: 100, // how slow actions should be
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

afterAll(async () => {
  browser.close();
});

describe("Posts tests", () => {
  beforeAll(async () => {
    await page.goto(`https://posts.itproto.com/`, {
      waitUntil: "domcontentloaded",
    });
  });

  it("page title", async () => {
    const title = await page.title();
    expect(title).toBe("Posts App v. 1.1");
  });

  it("type text", async () => {
    // Accept confirm dialog
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    // type post
    await page.type("textarea.form-control", "Hello World");
    // click add
    await page.click("button.btn-primary");
    const $delBtn = "button.posts-list_remBtn__xNP6W";
    // wait for  $del
    await page.waitForSelector($delBtn);
    let knopok = await page.$$($delBtn);
    // verify that 1 was added
    expect(knopok.length).toBe(1);
    // delete
    await page.click($delBtn);
    await page.waitFor(300);
    knopok = await page.$$($delBtn);
    expect(knopok.length).toBe(0);
  });
});
