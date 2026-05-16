import { Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly productItems: Locator;
  readonly addToCartButton: Locator;
  readonly basketCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.productItems = page.locator('[data-test="inventory-list"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart-"]');
    this.basketCount = page.locator(".shopping_cart_badge");
  }

  async navigate() {
    await this.page.goto("/inventory.html");
  }

  async getTitle() {
    return await this.title.textContent();
  }

  async addProductToCart(productName: string) {
    const productLocator = this.page.locator(
      `[data-test="add-to-cart-${productName}"]`,
    );
    await productLocator.click();
  }

  async getBasketCount() {
    const basketCountLocator = this.page.locator(".shopping_cart_badge");
    if (await basketCountLocator.isVisible()) {
      return await basketCountLocator.textContent();
    }
  }
}
