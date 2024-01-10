const generarId = ():string =>{
    const random = Math.random().toString(32).substring(2);
    const date = Date.now().toString(32);
    const uuid = crypto.randomUUID()
    return `${random}${date}${uuid}`;
}

export default generarId;