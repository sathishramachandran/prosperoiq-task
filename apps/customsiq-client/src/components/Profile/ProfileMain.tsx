// "use client";

// import { Button } from "@/components/ui/button";
// import InputField from "@/src/ui/Input";
// import z, { set } from "zod";
// import { useState } from "react";
// import { addInfoSchema, BillingSchema } from "@/src/Schemas/Profile";



// export type billingType = z.infer<typeof BillingSchema>;
// export type addInfoType = z.infer<typeof addInfoSchema>;

// const ProfileMain = () => {
//   const [isEdit, setIsEdit] = useState(false);

//   const [profile, setProfile] = useState({
//     org_name: "Acme Corp Pvt Ltd",
//     billing_address: "Chennai, Tamil Nadu",
//     billing_pan: "ABCDE1234F",
//     billing_gstin: "22AAAAA0000A1Z5",
//     ad_name: "Deepan Chakravarthi",
//     ad_email_id: "deepan@mail.com",
//     ad_phone_num: "9876543210",
//   });

//   const handleChange = (e: any) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     setIsEdit(false);
//   };
//   return (
//     <div className="p-8 text-white">
//       <div className="max-w-4xl mx-auto bg-[#23152E] rounded-2xl p-8">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold">Profile</h1>

//           {!isEdit ? (
//             <Button onClick={() => setIsEdit(true)}>Edit Profile</Button>
//           ) : (
//             <Button onClick={handleSave}>Save</Button>
//           )}  
//         </div>

//         {/* ORGANIZATION DETAILS */}
//         <h2 className="text-lg font-medium mb-4">Organization Details</h2>

//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             title="Organization Name"
//             name="org_name"
//             value={profile.org_name}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <InputField
//             title="Billing PAN"
//             name="billing_pan"
//             value={profile.billing_pan}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <InputField
//             title="Billing GSTIN"
//             name="billing_gstin"
//             disabled={!isEdit}
//           />
//         </div>

//         <div className="mt-5">
//           <TextArea
//             title="Billing Address"
//             name="billing_address"
//             value={profile.billing_address}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />
//         </div>

//         {/* ADMIN DETAILS */}
//         <h2 className="text-lg font-medium mt-8 mb-4">Admin Details</h2>

//         <div className="grid grid-cols-2 gap-5">
//           <InputField
//             title="Admin Name"
//             name="ad_name"
//             value={profile.ad_name}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />

//           <InputField
//             title="Email"
//             name="ad_email_id"
//             value={profile.ad_email_id}
//             disabled // usually not editable
//           />
//         </div>

//         <div className="mt-5">
//           <InputField
//             title="Mobile Number"
//             name="ad_phone_num"
//             value={profile.ad_phone_num}
//             onChange={handleChange}
//             disabled={!isEdit}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileMain;
