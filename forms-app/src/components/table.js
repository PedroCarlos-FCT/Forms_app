import { Card, Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const columnsHome = ["Title", "Description", "Last update on", "", ""];

const Table = ({ rows, columns = columnsHome, editable = true, respondable = true }) => {
  const navigate = useNavigate();
  
  const handleEdit = (id) => {
    navigate(`/edit-form?id=${id}`);
  };
  
  const handleRespond = (id) => {
    navigate(`/respond-form?id=${id}`);
  };

  return (
    <Card className="h-full w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              {columns.map((head, index) => (
                <th key={index} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              {editable && <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Edit</th>}
              {respondable && <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Respond</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even:bg-blue-gray-50/50' : ''}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                    {column.toLowerCase().replace(/\s+/g, '_') === "options" ? row.options.join(", ") : row[column.toLowerCase().replace(/\s+/g, '_')]}
                    </Typography>
                  </td>
                ))}
                {editable && <td className="p-4">
                  <Typography onClick={() => handleEdit(row["id"])} as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                    Edit
                  </Typography>
                </td>}
                {respondable && <td className="p-4">
                  <Typography onClick={() => handleRespond(row["id"])} as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                    Respond
                  </Typography>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default Table;

