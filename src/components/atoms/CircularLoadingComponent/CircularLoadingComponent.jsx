import classes from "./CircularLoadingComponent.module.css"

const CircularLoadingComponent = ({ size = "medium", color = "primary" }) => {
    return (
        <div className={`${classes.circularLoadingComponent} ${classes[size]} ${classes[color]}`}>
            <div className={classes.spinner}></div>
        </div>
    )
}

export default CircularLoadingComponent;