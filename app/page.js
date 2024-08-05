'use client'
import Image from "next/image";
import {useState,useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, deleteDoc, doc, getDocs, query, setDoc, getDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
    
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
     }
     else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity ===1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = inventory.filter(({name}) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredInventory(filtered)
    } else {
      setFilteredInventory(inventory)
    }
  }, [searchQuery,inventory])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
    width='100vw' 
    height='100vh' 
    display='flex' 
    flexDirection='column'
    justifyContent="center" 
    alignItems='center' 
    gap={2}
    sx={{
      backgroundImage: 'url(pngtree_food_icon_doodle.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition:'center'
      
    }}
    >

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #0000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection='column'
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
             }}
            />
          <Button variant='outlined' onClick={()=>{
            addItem(itemName)
            setItemName('')
            handleClose()
          }}>Add</Button> 
          </Stack>
        </Box>
      </Modal>




      <Stack direction='row' spacing={2} alignItems='center' mb={2}>
      <TextField
        variant='outlined'
        label='Search Items'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{width:'500px'}}>
      </TextField>

      <Button variant='contained'
      onClick={()=>{
        handleOpen()
        }}
      >
        Add New Item
      </Button>
      </Stack>





      <Box border='1px solid #333'>
        <Box 
          width="800px" 
          height='100px' 
          bgcolor='#D3D3D3'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Typography 
            variant = 'h3' 
            color = '#333'
            textAlign='center'
            fontWeight='bold'
            fontFamily='Roboto'
            letterSpacing='0.5px'
            sx={{ textTransform: 'uppercase', fontStyle: 'italic'}}
            >
            Inventory Items
          </Typography>
        </Box>
        
     <Stack width='800px' height='330px' spacing={2} overflow='auto'>
          {filteredInventory.map(({name, quantity}) => (
          <Box
            key={name}
            width='100%'
            minHeight='100px'
            display="flex"
            alignItems='center'
            justifyContent='space-between'
            bgColor='#DCDCDC'
            padding={5}
          >
            <Box
              width="200px" 
              height='50px' 
              bgcolor='#D3D3D3'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Typography 
                variant='h6'
                color='#333'
                textAlign='center'
                fontWeight='lighter'
                fontFamily='Roboto'
                letterSpacing='0.5px'
                sx={{textTransform: 'capitalize'}}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
            </Box>
             <Typography variant='h6'color='#333'textAlign='center'>
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
              sx={{':hover': {bgcolor :'#32CD32'}}}
              variant='contained'
              onClick={()=> {
                addItem(name)
              }}
              >
                Add
              </Button>
              <Button 
              sx={{':hover': {bgcolor: '#DC143C'}}}
              variant='contained' 
              onClick={()=> {
                removeItem(name)
              }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
          ))}
       </Stack>
      </Box>
    </Box>
  )
}
