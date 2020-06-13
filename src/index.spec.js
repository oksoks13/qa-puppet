const puppeteer = require("puppeteer");
/**@type {puppeteer.Browser} */
let browser;
/**@type {puppeteer.Page} */
let page;

jest.setTimeout(30000);

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: true, // headless mode set to false so browser opens up with visual feedback
    slowMo: false, // how slow actions should be
    devtools: true,
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
    expect(title).toBe("Posts App v. 1.1"); // VERIFY
  });

  it("type text", async () => {
    //===========SETUP pupetter
    // Accept confirm dialog
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    // type post
    await page.type("textarea.form-control", "Hello World");
    // click add
    await page.click("button.btn-primary");
    const delBtnSelector = "button.posts-list_remBtn__xNP6W";
    // wait for  $del
    await page.waitForSelector(delBtnSelector);
    let $$delButtons = await page.$$(delBtnSelector);
    // verify that 1 was added
    // VERFY
    expect($$delButtons.length).toBe(1);
    // delete
    await page.click(delBtnSelector);
    await page.waitFor(300);
    $$delButtons = await page.$$(delBtnSelector);
    expect($$delButtons.length).toBe(0);
  });

  it("should check content label", async () => {
    const $labelContent = await page.$eval(
      `label.form-label`,
      (el) => el.textContent
    );
    expect($labelContent).toBe("Content:");
  });
});
