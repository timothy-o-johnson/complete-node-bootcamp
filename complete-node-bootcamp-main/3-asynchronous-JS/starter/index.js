const fs = require('fs')
const superagent = require('superagent')

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject(err)
      resolve(data)
    }) 
  })
}

const asyncAwaitPractice = async () => {
  try {
    const fileData = await readFilePro(`${__dirname}/dog.txt`)
    var dogImageUrl = `https://dog.ceo/api/breed/${fileData}/images/random`

    const superAgentData1 = superagent.get(dogImageUrl)
    const superAgentData2 = superagent.get(dogImageUrl)
    const superAgentData3 = superagent.get(dogImageUrl)

    let imgs = await Promise.all([
      superAgentData1,
      superAgentData2,
      superAgentData3
    ])

    imgs = imgs.map(el => {
      return JSON.parse(el.text).message
    })
    console.log('imgs', imgs)

    var superAgentDataTextMessage = imgs.join('\n')

    const final = await writeFilePro('dog-img.txt', superAgentDataTextMessage)

    console.log('asyncAwaitPractice(): all done 🥳')
  } catch (err) {
    // console.log('error: ', err)
    throw 'error in asyncAwaitPractice'
  }
}

;(async () => {
  try {
    console.log('1: prior to async function')
    const asyncCall = await asyncAwaitPractice()
    console.log('3: after to async function')
  } catch (err) {
    console.log('error: ', err)
    throw 'error in parent scope 🔥 '
  }
})()

//   console.log('1: prior to async function');
//   const asyncCall = asyncAwaitPractice()
//   console.log('2: asyncAwaitPractice() call:', asyncCall);
//   console.log('3: after to async function');

// readFilePro(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log(`data from readFilePro: ${data}\n`)
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
//   })
//   .then(data => {
//     var dataTextMessage = JSON.parse(data.text).message
//     // console.log('dataTextMessage', dataTextMessage);

//     console.log(`data from superagent: ${dataTextMessage}\n`)
//     return writeFilePro('dog-img.txt', data)
//   })
//   .then(data => {
//     data = JSON.stringify(data)
//     // console.log(`data from writeFilePro: ${data}\n`)
//     console.log('all done! 🥳');

//   })
//   .catch(err => console.log(`Uh oh.... ${err}`))

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`)

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err)
//         return console.log(`Watch it! There's an error about... ${err.message}`)

//       console.log(res.body.message)

//       fs.writeFile('dog-img.txt', res.body.message, err => {
//         if (err) return console.log(err.message)
//         console.log(`Random dog image saved to file!`)
//       })
//     })
// })
