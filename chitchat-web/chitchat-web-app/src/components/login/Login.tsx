import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 20px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// `;

// const InputContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 20px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//   }
// `;

// const Label = styled.label`
//   margin-right: 10px;
// `;

// const Input = styled.input`
//   padding: 10px;
//   border-radius: 5px;
//   border: none;
//   width: 200px;
//   margin-right: 10px;
// `;

// const Button = styled.button`
//   padding: 10px;
//   background-color: #007aff;
//   color: #fff;
//   border-radius: 5px;
//   border: none;
//   //cursor: pointer;
//   width: 150px;
// `;

const Login = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Phone number:', phoneNumber);
//     console.log('Verification code:', verificationCode);
//   };

//   const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneNumber(e.target.value);
//   };

//   const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setVerificationCode(e.target.value);
//   };

  return (
    <></>
    // <Container>
    //   <Form onSubmit={handleSubmit}>
    //     <InputContainer>
    //       <Label>Phone Number:</Label>
    //       <Input
    //         type="tel"
    //         value={phoneNumber}
    //         onChange={handlePhoneNumberChange}
    //         placeholder="Enter phone number"
    //         required
    //       />
    //       <Button>Send Verification Code</Button>
    //     </InputContainer>
    //     <InputContainer>
    //       <Label>Verification Code:</Label>
    //       <Input
    //         type="text"
    //         value={verificationCode}
    //         onChange={handleVerificationCodeChange}
    //         placeholder="Enter verification code"
    //         required
    //       />
    //     </InputContainer>
    //     <Button type="submit">Submit</Button>
    //   </Form>
    // </Container>
  );
};

export default Login
