const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ExecutionTable.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Table Headers
const headerTarget = `<th className="py-4 px-6 text-indigo-200 font-semibold w-1/3">Expected Result</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold w-48">Status</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold">Notes</th>`;
const headerReplacement = `<th className="py-4 px-6 text-indigo-200 font-semibold w-1/3">Expected Result</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold w-40">Assign to</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold w-48">Status</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold">Notes</th>`;
content = content.replace(headerTarget, headerReplacement);

// Update Table Body Row
const rowTarget = `<td className="py-4 px-6 relative" onClick={(e) => e.stopPropagation()}>`;

const assigneeLogic = `
                  <td className="py-4 px-6">
                    {claim && claim.claimedBy ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px] border border-indigo-500/30">
                          {claim.claimedBy.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white/80 text-sm font-medium">{claim.claimedBy.name}</span>
                      </div>
                    ) : (
                      <span className="text-white/40 text-sm italic">Unassigned</span>
                    )}
                  </td>
`;

content = content.replace(rowTarget, assigneeLogic + rowTarget);

// Wait, is there a colspan that needs to be updated?
const expandedRowTarget = `<td colSpan={5} className="p-0 border-b border-slate-800">`;
const expandedRowReplacement = `<td colSpan={6} className="p-0 border-b border-slate-800">`;
content = content.replace(expandedRowTarget, expandedRowReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated ExecutionTable.tsx with Assign to column');
