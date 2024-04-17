  "use client"
  import { useEffect, useState } from  "react";
  import  secureLocalStorage  from  "react-secure-storage";

    
  const App = () => {
    const [Value, setValue] = useState()
      useEffect(() => {
        secureLocalStorage.setItem("object", {
          message:  "This is testing of local storage",
        });
        secureLocalStorage.setItem("harry", 12);
        // secureLocalStorage.setItem("string", "12");
        secureLocalStorage.setItem("boolean", true);

        const value = secureLocalStorage.getItem("harry");
        setValue(value)
    }, []);

    return (
        <div>
          this is working. {Value}
        </div>
    );
  }

  export  default  App;