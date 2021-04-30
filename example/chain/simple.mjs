class AddMonth {
  replace (filePath) {
    const month = new Intl.DateTimeFormat('en-gb', { month: 'long' }).format(new Date())
    return filePath.replace(/^/, `[${month}] `)
  }
}

export default AddMonth
