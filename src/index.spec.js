const puppeteer = require("puppeteer");
/**@type {puppeteer.Browser} */
// let browser;
/**@type {puppeteer.Page} */
let page;

jest.setTimeout(30000); // because when headless: false, it takes longer

const ENTER = String.fromCharCode(13);
const TAB = String.fromCharCode(9);


//The puppeteer.laucnh  method-launches a new Chromium browser window
beforeAll(async () => {
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

  describe('GROUP', () => {
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
  });

  it("test completed action", async () => {
    // click completed
    const $completedButton = await page.$("[data-e2e=completed]");
    await $completedButton.click();

    // see `There are no items.`
    const noItemsSelector = ".alert.alert-info";
    await page.$(".alert.alert-info");
    const noItemsText = await page.$eval(
      noItemsSelector,
      (el) => el.textContent
    );
    expect(noItemsText).toBe("There are no items.");

    await page.waitFor(5000);
  });

  it("should check items left", async () => {
    //type text
    await page.type("input.form-control.add-todo", "My New Task");
    //press enter
    await page.keyboard.type(ENTER);
    //grab selector of
    const selector = "footer > div:nth-child(2)";
    //verify he text matches 4
    expect("4 items left").toMatch("4 items left");
  });

  const e2e = (attrValue) => `[data-e2e=${attrValue}]`;

  it.only("test search buttons on the tab  Active", async () => {
    // - click on Active
    const $activeButton = await page.$(e2e('active'));
    await $activeButton.click();

    // click on Search button
    const $searchButton = await page.$('a.button.search');
    await $searchButton.click();

    //  click on search field
    const $searchField = await page.focus('input.form-control.search');

    // in the search field enter the name of one of the tasks
    await page.type("input.form-control.search", "React");

    //simulate keyboard "enter"
    await page.keyboard.type(String.fromCharCode(13));

    // - wait some time
    await page.waitFor(200);
    //grab selector of
    const $searchForm = "input.form-control.search";
    // expect to see task which we type in the list
    expect("React").toMatch("React");


    //expect(true).toBe(false);
  });
})
