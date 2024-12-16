import { expect, test } from '@playwright/test';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import * as XLSX from 'xlsx'; 

import { validatePriceFormat, validateProductName, validateProductAvailability, validateProductCount, validateCompleteData, validateUniqueImages, validateDiscount } from './scraperValidation';

test('Scraper com validação de dados - Sauce Demo', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  
 
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');


  await page.waitForSelector('.inventory_list');


  const productElements = await page.locator('.inventory_item');

  const products: Array<{ name: string; price: string; image: string, availability: string, discount: string }> = [];

  for (let i = 0; i < await productElements.count(); i++) {
    const product = productElements.nth(i);

    const name = await product.locator('.inventory_item_name').textContent() ?? 'Produto sem nome';
    const price = await product.locator('.inventory_item_price').textContent() ?? 'Preço não disponível';
    const image = await product.locator('img.inventory_item_img').getAttribute('src') ?? 'Imagem não disponível';
  
    const availability = await product.locator('.inventory_item_desc').textContent() ?? 'Disponibilidade não informada';
    const discount = '0%'; 
    products.push({
      name: name.trim(),
      price: price.trim(),
      image: image.trim(),
      availability: availability.trim(),
      discount: discount,
    });
  }

// Validations
  validatePriceFormat(products);
  validateProductName(products);
  validateProductAvailability(products);
  validateProductCount(products, 1); 
  validateCompleteData(products);
  validateUniqueImages(products);
  validateDiscount(products);

  const outputPath = './scraped-data/saucedemo-products.xlsx';
  try {
    const worksheetData = products.map(product => ({
      'Product Name': product.name,
      'Price': product.price,
      'Image URL': product.image,
      'Availability': product.availability,
      'Discount': product.discount,
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    XLSX.writeFile(wb, outputPath);

    console.log(`Dados coletados com sucesso! Salvo em: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao salvar os dados no arquivo Excel:', error);
  }

  expect(products.length).toBeGreaterThan(0);
});
