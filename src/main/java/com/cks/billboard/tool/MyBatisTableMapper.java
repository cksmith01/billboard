package com.cks.billboard.tool;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class MyBatisTableMapper {

    @Autowired
    DataSource dataSource;

    public String buildPojoAndDao(String tableName, String pkColumn) {
        //POJO
        String beanName = getBeanName(tableName);
        System.out.println("");
        System.out.println("import lombok.*;");
        System.out.println("");
        System.out.println("@Data");
        System.out.println("@AllArgsConstructor");
        System.out.println("@NoArgsConstructor");
        System.out.println("public class "+beanName+" {");
        createPojo(tableName);
        System.out.println("");
        System.out.println("}");

        // DAO
        System.out.println("");
        System.out.println("import org.apache.ibatis.annotations.*;");
        System.out.println("");
        System.out.println("@Mapper");
        System.out.println("public interface "+beanName+"Dao {");
        createSelectStatement(tableName, pkColumn);
        createInsertStatement(tableName, pkColumn);
        createUpdateStatement(tableName, pkColumn);
        createDeletStatement(tableName, pkColumn);
        System.out.println("");
        System.out.println("}");

        return "done";
    }

    private List<Field> buildFieldList(String tableName) throws SQLException {
        Connection conn = dataSource.getConnection();
        ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM "+tableName+" LIMIT 1");
        ResultSetMetaData rsmd = rs.getMetaData();

        List<Field> list = new ArrayList<Field>();
        for (int i=1; i<=rsmd.getColumnCount(); i++) {
            Field field = new Field();
            field.columnName = rsmd.getColumnName(i);
            field.columnType = rsmd.getColumnClassName(i);
            field.javaType = field.columnType.substring(field.columnType.lastIndexOf(".") + 1);
            field.camelCaseName = camelCase(field.columnName);
            list.add(field);
        }

        return list;
    }

    private String getBeanName(String tableName) {
        String beanName = camelCase(tableName);
        return beanName.substring(0,1).toUpperCase()+beanName.substring(1);
    }

    public void createPojo(String tableName) {
        try {
            List<Field> list = buildFieldList(tableName);
            list.forEach( item -> {
                System.out.println("private " + item.javaType + " " + item.camelCaseName + ";");
                if (item.javaType.toLowerCase().equals("object")) {
                    System.out.println("^^^");
                }
            });

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private String camelCase(String field) {
        if (field != null) {
            if (field.indexOf("_") > -1) {
                String[] split = field.split("_");
                String _field = split[0].toLowerCase();
                for (int i = 1; i < split.length; i++) {
                    String next = split[i].toLowerCase();
                    String first = next.substring(0,1);
                    String rest = next.substring(1);
                    _field += first.toUpperCase()+rest;
                }
                return _field;
            } else {
                field = field.toLowerCase();
            }
        }
        return field;
    }

    public void createSelectStatement(String tableName, String pkColum) {
        try {
            String beanName = getBeanName(tableName);
            String pkVariable = camelCase(pkColum);

            StringBuilder sb = new StringBuilder();
            List<Field> list = buildFieldList(tableName);
            list.forEach( item -> {
                sb.append("\t" + item.columnName + " AS " + item.camelCaseName + ",\n");
            });

            String fields = sb.toString();

            System.out.println("final String SELECT = \"\"\"");
            System.out.println("SELECT\n" + fields.substring(0, fields.length()-2) + "\nFROM " + tableName);
            System.out.println("\"\"\";");

            System.out.println("");

            System.out.println("@Select(SELECT)");
            System.out.println("List<"+beanName+"> getAll" + beanName + "s();");
            System.out.println("");

            System.out.println("@Select(SELECT + \" WHERE " + pkColum + " = #{" + pkVariable + "}\")");
            System.out.println(beanName + " get" + beanName + "ById(@Param(\"" + pkVariable + "\") Integer " + pkVariable + ");");
            System.out.println("");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void createInsertStatement(String tableName, String pkColumn) {
        try {
            String beanName = getBeanName(tableName);

            StringBuilder columns = new StringBuilder();
            StringBuilder values = new StringBuilder();
            List<Field> list = buildFieldList(tableName);
            list.forEach( item -> {
                columns.append("\t" + item.columnName +",\n");
                String sqlType = "NUMERIC";
                if (item.javaType.equals("String")) sqlType = "VARCHAR";
                values.append("\t#{" + item.camelCaseName + ", jdbcType="+sqlType+"}, \n");
            });

            String columnList = columns.toString();

            String stmt = "INSERT INTO " + tableName + " (\n" + columnList.substring(0, columnList.length() - 2);
            stmt += "\n) VALUES (\n";
            stmt += values.substring(0, values.length() - 3) + "\n);";

            System.out.println("final String INSERT = \"\"\"");
            System.out.println(stmt);
            System.out.println("\"\"\";");

            System.out.println("");

//            @Options(useGeneratedKeys = true, keyProperty = "eventId", keyColumn = "event_id")
            System.out.println("@Options(useGeneratedKeys = true, keyProperty = \"" + camelCase(pkColumn) + "\", keyColumn = \"" + pkColumn + "\")");
            System.out.println("@Insert(INSERT)");
            System.out.println("Integer insert" + beanName + " (" + beanName + " " + camelCase(tableName) + ");");
            System.out.println("");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void createUpdateStatement(String tableName, String pkColumn) {
        try {
            String beanName = getBeanName(tableName);

            Field pkField = null;
            StringBuilder columns = new StringBuilder();
            StringBuilder values = new StringBuilder();
            List<Field> list = buildFieldList(tableName);
            for (Field field : list) {
                if (!field.columnName.equals(pkColumn)) {
                    columns.append("\t" + field.columnName + " = ");
                    String sqlType = "NUMERIC";
                    if (field.javaType.equals("String")) sqlType = "VARCHAR";
                    columns.append("#{" + field.camelCaseName + ", jdbcType=" + sqlType + "}, \n");
                } else {
                    pkField = field;
                }
            }

            String columnList = columns.toString();

            String sqlType = "NUMERIC";
            if (pkField.javaType.equals("String")) sqlType = "VARCHAR";

            String stmt = "UPDATE " + tableName + " SET\n " + columnList.substring(0, columnList.length() - 3);
            stmt += "\n WHERE " + pkColumn + " = #{" + pkField.camelCaseName + ", jdbcType=" + sqlType + "};";

            System.out.println("final String UPDATE = \"\"\"");
            System.out.println(stmt);
            System.out.println("\"\"\";");

            System.out.println("");

            System.out.println("@Update(UPDATE)");
            System.out.println("Integer update" + beanName + " (" + beanName + " " + camelCase(tableName) + ");");
            System.out.println("");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void createDeletStatement(String tableName, String pkColumn) {
        String beanName = getBeanName(tableName);
        String pkField = camelCase(pkColumn);
        System.out.println("final String DELETE = \"\"\"");
        System.out.println("\tDELETE FROM " + tableName + " WHERE " + pkColumn + " = #{" + pkField + ",jdbcType=NUMERIC};");
        System.out.println("\"\"\";");

        System.out.println("");

        System.out.println("@Delete(DELETE)");
        System.out.println("Integer delete" + beanName + " (@Param(\"" + camelCase(pkColumn) + "\") Integer " + camelCase(pkColumn) + ");");
        System.out.println("");

    }

    class Field {
        String columnName;
        String columnType;
        String javaType;
        String camelCaseName;
    }

}
