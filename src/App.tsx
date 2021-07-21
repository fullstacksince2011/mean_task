import React from 'react';
import './App.css';
import Wallet from '@project-serum/sol-wallet-adapter';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function App() {
  const providerUrl = 'https://www.sollet.io';
  const wallet = new Wallet(providerUrl, '');

  //form
  const form = useFormik({
    initialValues: {
      address: "",
      message: "",
      signature: ""
    },
    validationSchema: Yup.object({
      message: Yup.string().trim().required('Message is required'),
    }),
    onSubmit: values => {
      console.log(values)
      signMessage(values.message)
    }
  })

  // called on sign button click through formik onSubmit
  const signMessage = async (message: string) => {
    wallet.on('connect', async (publicKey: any) => {
      form.setFieldValue('address', publicKey.toBase58());
      const data = new TextEncoder().encode(message);
      let { signature } = await wallet.sign(data, 'utf8');
      console.log(signature)
      form.setFieldValue('signature', signature)
    });
    wallet.on('disconnect', () => console.log('Disconnected'));
    await wallet.connect();
  }
  return (
    <div className="App">
      <form onSubmit={form.handleSubmit}>
        <div className="form-control">
          <label>Solana Address (Read only)</label>
          <input
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.address}
            disabled={true}
            name="address"
            type="text"
            placeholder=''
          />
          {form.touched.address && form.errors.address
            ? <div className="error">{form.errors.address}</div>
            : null}
        </div>
        <div className="form-control">
          <label>Message</label>
          <input
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.message}
            name="message"
            type="text"
            placeholder='Please type random message'
          />
          {form.touched.message && form.errors.message
            ? <div className="error">{form.errors.message}</div>
            : null}
        </div>
        <div className="form-control">
          <label>Signature (Read only)</label>
          <input
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.signature}
            disabled={true}
            name="signature"
            type="text"
            placeholder=''
          />
          {form.touched.signature && form.errors.signature
            ? <div className="error">{form.errors.signature}</div>
            : null}
        </div>
        <button className="btn" type="submit">Sign</button>
      </form>
    </div>
  );
}

export default App;
