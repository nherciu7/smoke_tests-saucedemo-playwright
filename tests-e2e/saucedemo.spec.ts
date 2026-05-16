import { test, expect } from "../fixtures";
import users from "../data/users.json";
import products from "../data/products.json";
import checkout from "../data/checkout.json";
import messages from "../data/messages.json";

test.describe("SauceDemo Login Scenarios", () => {
  test("1.Login succesfully", async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    await expect(page).toHaveURL("/inventory.html");
    await expect(inventoryPage.getTitle()).resolves.toBe(
      messages.inventoryTitle,
    );
    await expect(inventoryPage.productItems).toBeVisible();
  });

  test("2.Login with invalid credentials", async ({ loginPage }) => {
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password,
    );

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(messages.invalidLoginError);
  });

  test("3.Add product to cart and verify basket count", async ({
    loginPage,
    inventoryPage,
    cartPage,
    page,
  }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    await inventoryPage.addProductToCart(products.backpack.id);
    const basketCount = await inventoryPage.getBasketCount();
    expect(basketCount).toBe("1");

    await inventoryPage.goToCart();
    await expect(page).toHaveURL("/cart.html");
    await expect(cartPage.getItemByName(products.backpack.name)).toBeVisible();
  });

  test("4.Complete checkout", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    await inventoryPage.addProductToCart(products.backpack.id);
    await inventoryPage.goToCart();

    await cartPage.checkout();

    await checkoutPage.fillInfo(
      checkout.customer.firstName,
      checkout.customer.lastName,
      checkout.customer.postalCode,
    );
    await checkoutPage.continue();
    await checkoutPage.finish();

    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toBe(messages.checkoutConfirmation);
  });
});
