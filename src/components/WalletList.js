import React from 'react';
import WalletCard from './WalletCard';

const addresses = [
    '0x9aAF2F84AfB2162A1efA57018bd4B1Ae0dA28ccE',
    '0xF4FaCa935238f1F12ce0E5499a567946b8556A0B'
]

const WalletList=()=>{
    const renderedList=addresses.map((address)=>{
        return <WalletCard key={address} address={address}/>
    })
    return(
        <div className='ui container'>{renderedList}</div>
    )
}

export default WalletList;