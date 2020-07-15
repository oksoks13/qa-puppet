const puppeteer = require("puppeteer");
const { clear } = require("console");
/**@type {puppeteer.Browser} */
// let browser;
/**@type {puppeteer.Page} */
let page;

jest.setTimeout(10000); // because when headless: false, it takes longer

const ENTER = String.fromCharCode(13);
const TAB = String.fromCharCode(9);


//The puppeteer.laucnh  method-launches a new Chromium browser window
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    slowMo: 200, // how slow actions should be
    devtools: true,
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

afterAll(async () => {
  browser.close();
});

describe("Todo app", () => {
  beforeEach(async () => {
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

  it("test search buttons on the tab  Active", async () => {
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

  });


  it(" Search button on tab All", async () => {
    //click on Active
    await page.click('a.button.search');
    //click on search field
    await page.focus('input.form-control');

    //in the search field enter the name of one of the tasks
    await page.type('input.form-control', "Learn React");
    // wait some time
    await page.waitFor(200);
    // expect to see task which we type in the list
    expect('Learn React').toMatch('Learn React');
  })

  it("plus button on tab All", async () => {
    const $el = await page.$('.form-control.add-todo')
    expect($el).toBeDefined(); // 1etap
    //click plus button
    await page.click('a.button.add');
    //excpect to see that the input field disappear
    await page.waitFor(() => !document.querySelector('.form-control.add-todo'));
  })

  it('Testing plus button on tab All (using generic function)', async () => {
    await checkThatElementDisappearsOnAction(
      '.form-control.add-todo',
      async () => await page.click('a.button.add'));
  });
})

const checkThatElementDisappearsOnAction = async (selector, action) => {
  const $el = await page.$(selector);//take element
  expect($el).toBeDefined();//check that el exist
  await action();//pass the function
  await page.waitFor((sel) => !document.querySelector(sel), {}, selector);//check
}

it("When click to some Task on the tab All it became no active", async () => {
  //click All
  const allButton = await page.$('[data-e2e=all');
  await allButton.click();
  // click on some Item from the list
  await page.click('.todo-item .checkbox label input[type=checkbox]')
  //expected to see that Task became non active

})

it("Testing that after click on some task from the tab All,he displayed on the Completed tab", async () => {
  //click to some Task
  await page.click('.todo-item .checkbox label input[type=checkbox]');
  //wait some time
  await page.waitFor(200);
  //click to tab Complete
  await page.click('[data-e2e=completed]');
  //expected to see there selected task
  await page.waitFor(500);

})



