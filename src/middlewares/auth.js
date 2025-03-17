 const adminAuth = (req, res,next) => {
    const token ='xyz';
  const isautohenticated = token === 'xyz';
  if (!isautohenticated){
     res.status(401).send('unauthorized');
  }else{
     next();
  }
   }

   module.exports = {adminAuth};