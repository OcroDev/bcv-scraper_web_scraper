import puppeteer from 'puppeteer'

export default async function bcvScraping() {
  let browser, page

  try {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  }catch (err) {
    throw new Error('could not create a browser instance => : ', err)
  }

  async function getPageData() {
    await page.goto('http://bcv.org.ve')
    await page.waitForSelector('#dolar')
    let data = await page.$$eval('.centrado', textData => {
      textData = textData.map(el => el.querySelector('strong').textContent.replace(',', '.'))
      console.log(textData)
      dataNumber = textData.map(el => Number.parseFloat(el).toFixed(2))
      return dataNumber
    })

    let exchangeRate = {
      eur: data[0],
      cny: data[1],
      try: data[2],
      rub: data[3],
      usd: data[4],
    }

    return exchangeRate
  }

  let exchange = await getPageData()
  await browser.close()
  //aqui se retorna el objeto con los datos de las tasas de cambio del BCV
  return exchange
}

//funcion que recupera los datos
console.log(await bcvScraping())