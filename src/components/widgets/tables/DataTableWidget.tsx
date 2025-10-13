import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DataTableWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const tableData = data || [];
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      ) : (
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row: any, idx: number) => (
                <TableRow key={idx}>
                  {columns.map(col => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </BaseWidget>
  );
};
