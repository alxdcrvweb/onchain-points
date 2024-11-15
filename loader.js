async function main() {
  for (let i = 0; i < 10; i++) {
    const res = await fetch("http://bot.onchaincoin.io")
    console.log(res.status)
  }
}


main()
