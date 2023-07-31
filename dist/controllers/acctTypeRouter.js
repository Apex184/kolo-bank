"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { AccountType } from '../models/acctTypeSchema';
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
// export const SelectAccountType = async (req: Request, res: Response): Promise<unknown> => {
//     try {
//         const { acctType } = req.body;
//         const existingAcctType = await AccountType.findOne({ acctType: req.body.acctType });
//         if (existingAcctType) {
//             return errorResponse(res, 'Account type already exists', httpStatus.CONFLICT);
//         }
//         const chosenAccountType = await AccountType.create({
//             acctType: acctType
//         });
//         res.status(httpStatus.CREATED).json({
//             message: 'Account type created successfully',
//             data: {
//                 chosenAccountType,
//             },
//         });
//         return;
//     } catch (error) {
//         console.log(error)
//     }
// }
// function errorResponse(res: Response<any, Record<string, any>>, arg1: string, CONFLICT: number): unknown {
//     throw new Error('Function not implemented.');
// }
//# sourceMappingURL=acctTypeRouter.js.map