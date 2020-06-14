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
    devtools: true,
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

afterAll(async () => {
  browser.close();
});

describe("Todo app", () => {
  beforeAll(async () => {
    await page.goto(`http://oksi-todo.itproto.com`, {
      waitUntil: "domcontentloaded",
    });
  });

  it("should be correct title", async () => {
    const title = await page.title();
    expect(title).toBe("E2E v.1");
  });

  it("should add todo item", async () => {
    const $$liElements1 = await page.$$(`[data-e2e=todo-items] li`);
    expect($$liElements1.length).toBe(3);
    // type text
    await page.type("input.form-control.add-todo", "My New Task");
    // simulate keyboard enter
    await page.keyboard.type(String.fromCharCode(13));
    // wait a bit
    await page.waitFor(100);
    // expect that we have 4 item
    const $myList = await page.$(`[data-e2e=todo-items]`);
    $myList.screenshot({ path: "list.png" });
    const $$liElements2 = await page.$$(`[data-e2e=todo-items] li`);
    expect($$liElements2.length).toBe(4);
  });

  /*
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
  });*/
});
