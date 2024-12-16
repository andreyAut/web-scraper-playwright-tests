
export function validatePriceFormat(products: Array<{
  name: any; price: string 
}>) {
  const priceRegex = /^\d+(\.\d{2})?$/; 
  
  products.forEach((product, index) => {
    if (!priceRegex.test(product.price)) {
      console.error(`Preço inválido para o produto ${product.name} (Índice ${index}): ${product.price}`);
    }
  });
}

export async function validateProductName(products: Array<{ name: string }>) {
  const nameRegex = /^[a-zA-Z0-9\s\-]+$/; 

 
  const fetch = (await import('node-fetch')).default; 

  products.forEach((product, index) => {
    if (!nameRegex.test(product.name)) {
      console.error(`Nome inválido para o produto no índice ${index}: ${product.name}`);
    }
  });
}


export function validateProductAvailability(products: Array<{ name: string; availability: string }>) {
  products.forEach((product, index) => {
    if (product.availability !== 'Em estoque' && product.availability !== 'Fora de estoque') {
      console.error(`Disponibilidade inválida para o produto ${product.name} (Índice ${index}): ${product.availability}`);
    }
  });
}

export function validateProductCount(products: Array<{ name: string }>, expectedMinCount: number) {
  if (products.length < expectedMinCount) {
    console.warn(`A quantidade de produtos coletados é menor que o esperado. Encontrado ${products.length}, esperado no mínimo ${expectedMinCount}.`);
  }
}

export function validateCompleteData(products: Array<{ name: string; price: string; image: string }>) {
  products.forEach((product, index) => {
    if (!product.name || !product.price || !product.image) {
      console.error(`Produto incompleto encontrado no índice ${index}:`, product);
    }
  });
}

export function validateUniqueImages(products: Array<{ name: string; image: string }>) {
  const imageSet = new Set();
  products.forEach((product, index) => {
    if (imageSet.has(product.image)) {
      console.error(`Imagem duplicada encontrada para o produto ${product.name} (Índice ${index})`);
    } else {
      imageSet.add(product.image);
    }
  });
}



export function validateDiscount(products: Array<{ name: string; price: string; discount: string }>) {
  products.forEach((product, index) => {
    if (product.discount && !product.price) {
      console.error(`Produto ${product.name} (Índice ${index}) tem desconto, mas o preço não está disponível.`);
    }
  });
}
