export default function ArticleBody({ blocks }) {
  return (
    <div className="advice-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h4 key={index}>{block.text}</h4>;
          case "table":
            return (
              <div className="advice-table" key={index}>
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((header, column) => (
                        <th scope="col" key={column}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, column) => (
                          <td key={column}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </div>
  );
}
