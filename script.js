import puppeteer from 'puppeteer'

export default async function bcvScraping() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    async function getPageData() {
      await page.goto('http://bcv.org.ve')
      await page.waitForSelector('#dolar')
      const data = await page.$$eval('.centrado', textData => {
        textData = textData.map(el => el.querySelector('strong').textContent.replace(',', '.'))
        console.log(textData)
        dataNumber = textData.map(el => Number.parseFloat(el).toFixed(2))
        return dataNumber
      })

      const exchangeRate = {
        eur: data[0],
        cny: data[1],
        try: data[2],
        rub: data[3],
        usd: data[4],
      }

      return exchangeRate
    }

    const exchange = await getPageData()
    await browser.close()

    // Here is the object containing the data for the exchange rates from the BCV.
    return exchange

  }catch (err) {
    throw new Error('could not create a browser instance => : ', err)
  }
}

// Function that retrieves the data.
bcvScraping()
  .then(exchange => console.log(exchange))
  .catch(err => console.log(err))
